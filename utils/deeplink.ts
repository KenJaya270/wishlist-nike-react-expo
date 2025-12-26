import * as Linking from "expo-linking";

export const makeDeepLink = (id: string) => {
  return Linking.createURL(`detail/${id}`);
};

// Output:
// wishlistapp://detail/123
