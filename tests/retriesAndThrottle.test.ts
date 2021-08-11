/* eslint-disable no-underscore-dangle */
import { RequestError } from "@octokit/request-error";
import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

function testPlugin(octo) {
  const t0 = Date.now();
  octo.__requestLog = [];
  octo.__requestTimings = [];

  octo.hook.wrap("request", async (request, options) => {
    octo.__requestLog.push(`START ${options.method} ${options.url}`);
    octo.__requestTimings.push(Date.now() - t0);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const res = options.request.responses.shift();
    if (res.status >= 300) {
      const message =
        res.data.message != null
          ? res.data.message
          : `Test failed request (${res.status})`;
      const error = new RequestError(message, res.status, {
        headers: res.headers,
        request: options,
      });
      throw error;
    } else {
      octo.__requestLog.push(`END ${options.method} ${options.url}`);
      octo.__requestTimings.push(Date.now() - t0);
      return res;
    }
  });
}

describe("Automatic Retries", () => {
  it("Should retry twice and fail", async () => {
    const client = (await octokit(testPlugin)) as Octokit;
    try {
      await client.request("GET /route", {
        request: {
          responses: [
            { status: 403, headers: {}, data: { message: "ONE" } },
            { status: 403, headers: {}, data: { message: "TWO" } },
            { status: 401, headers: {}, data: { message: "THREE" } },
          ],
          retries: 2,
        },
      });
      throw new Error("Should not reach this point");
    } catch (error) {
      expect(error.status).toEqual(401);
      expect(error.message).toEqual("THREE");
    }

    expect(client.__requestLog).toStrictEqual([
      "START GET /route",
      "START GET /route",
      "START GET /route",
    ]);

    expect(
      client.__requestTimings[1] - client.__requestTimings[0]
    ).toBeLessThan(20);
    expect(
      client.__requestTimings[2] - client.__requestTimings[1]
    ).toBeLessThan(20);
  });

  it("Should retry once and fail", async () => {
    const client = (await octokit(testPlugin)) as Octokit;
    try {
      await client.request("GET /route", {
        request: {
          responses: [
            { status: 403, headers: {}, data: { message: "ONE" } },
            { status: 403, headers: {}, data: { message: "TWO" } },
            { status: 401, headers: {}, data: { message: "THREE" } },
          ],
          retries: 1,
        },
      });
      throw new Error("Should not reach this point");
    } catch (error) {
      expect(error.status).toEqual(403);
      expect(error.message).toEqual("TWO");
    }

    expect(client.__requestLog).toStrictEqual([
      "START GET /route",
      "START GET /route",
    ]);

    expect(
      client.__requestTimings[1] - client.__requestTimings[0]
    ).toBeLessThan(20);
  });

  it("Should linearize requests (throttle requests)", async () => {
    const client = (await octokit(testPlugin)) as Octokit;
    const req1 = client.request("GET /route1", {
      request: {
        responses: [{ status: 201, headers: {}, data: {} }],
      },
    });

    const req2 = client.request("GET /route2", {
      request: {
        responses: [{ status: 202, headers: {}, data: {} }],
      },
    });

    const req3 = client.request("GET /route3", {
      request: {
        responses: [{ status: 203, headers: {}, data: {} }],
      },
    });

    await Promise.all([req1, req2, req3]);
    expect(client.__requestLog).toStrictEqual([
      "START GET /route1",
      "END GET /route1",
      "START GET /route2",
      "END GET /route2",
      "START GET /route3",
      "END GET /route3",
    ]);
  });
});
