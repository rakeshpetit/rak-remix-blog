import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import type { Bookmark } from "@prisma/client";
import { db } from "~/utils/db.server";

type LoaderData = { bookmarks: Array<Bookmark> };
export let loader: LoaderFunction = async () => {
  let data: LoaderData = {
    bookmarks: await db.bookmark.findMany(),
  };
  return data;
};

export let meta: MetaFunction = () => {
  return {
    title: "My bookmarks",
    description: "My reading list",
  };
};

export default function () {
  let data = useLoaderData<LoaderData>();
  console.log("da", data);
  return (
    <div className="remix__page">
      <main>
        <h1 className="pt-5 text-2xl text-left text-teal-500 font-bold sm:text-3xl">
          Bookmarks
        </h1>
        {data.bookmarks.map((bookmark) => (
          <li>{bookmark.title}</li>
        ))}
      </main>
    </div>
  );
}
