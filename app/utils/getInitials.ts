export function getInitials(name: string) {
  let initials = "";

  // Split the name into words
  const words = name.split(" ");

  // If there are two or more words, get the first two letters of each
  if (words.length >= 2) {
    initials =
      words[0].substring(0, 1).toUpperCase() +
      words[1].substring(0, 1).toUpperCase();
  } else {
    // Otherwise, get the first two letters of the name (or less if the name is shorter than 2 characters)
    initials = name.substring(0, 2).toUpperCase();
  }

  return initials;
}
