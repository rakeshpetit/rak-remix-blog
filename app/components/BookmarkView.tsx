import type { Bookmark } from "@prisma/client";

type Props = {
  bookmark: Bookmark;
};

function BookmarkView({ bookmark }: Props) {
  const iconUrl = `https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmark.url}`;

  return (
    <div className="shadow-lg rounded-2xl p-4 relative overflow-hidden flex flex-row">
      <div className="rounded-sm pt-2">
        <img alt="icon" src={iconUrl} className="h-10 w-10" />
      </div>
      <div className="flex-1 flex-col ml-4">
        <a rel="noopener" target="_blank" href={bookmark.url}>
          <div className="text-xl font-medium not-italic text-left">
            {bookmark.title}
          </div>
        </a>
        <div className="text-gray-600 dark:text-gray-300 text-base font-normal mb-2 text-left">
          {bookmark.title}
        </div>
        <div className="text-gray-400 dark:text-gray-400 text-xs text-right">{`Added on: ${bookmark.createdAt}`}</div>
      </div>
    </div>
  );
}

export default BookmarkView;
