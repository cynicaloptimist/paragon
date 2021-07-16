import React from "react";

type Listing = {
  name: string;
  folder?: string;
};

export function FoldersWithListings(props: { listings: Listing[] }) {
  const listingsByFolder: Record<string, Listing[]> = {};
  const listingsInRoot: Listing[] = [];

  for (const listing of props.listings) {
    if (!listing.folder) {
      listingsInRoot.push(listing);
      return;
    }

    if (listingsByFolder[listing.folder] === undefined) {
      listingsByFolder[listing.folder] = [];
    }

    listingsByFolder[listing.folder].push(listing);
  }

  const rootListingElements = listingsInRoot.map((l) => {
    return <li key={l.name}>{l.name}</li>;
  });

  const folderElements = Object.keys(listingsByFolder).map((folderName) => {
    const innerListingElements = listingsByFolder[folderName].map((l) => {
      return <li key={l.name}>{l.name}</li>;
    });
    return (
      <>
        <li>{folderName}</li>
        <ul className="folder">{innerListingElements}</ul>
      </>
    );
  });

  return (
    <ul>
      {rootListingElements}
      {folderElements}
    </ul>
  );
}
