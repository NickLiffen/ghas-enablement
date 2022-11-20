/**
 * Get the CodeQL language that corresponds to the primary language for the repo.
 * Any language that does not match a currently supported language in CodeQL will return no-language
 * @param primaryLanguage
 * @returns the CodeQL mapped language
 */
export const getcodeQLLanguage = (primaryLanguage: string): string => {
  const formattedLanguage = primaryLanguage.toLocaleLowerCase();
  let codeQLLang = "";
  switch (formattedLanguage) {
    case "javascript":
      codeQLLang = "javascript";
      break;
    case "java":
      codeQLLang = "java";
      break;
    case "go":
      codeQLLang = "go";
      break;
    case "python":
      codeQLLang = "python";
      break;
    case "c++":
      codeQLLang = "cpp";
      break;
    case "c#":
      codeQLLang = "csharp";
      break;
    case "ruby":
      codeQLLang = "ruby";
      break;
    default:
      codeQLLang = "no-language";
      break;
  }

  return codeQLLang;
};
