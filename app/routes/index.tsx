import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Rakesh Arunachalam",
    description: "Built using remix",
  };
};

export default function Index() {
  return (
    <div className="remix__page">
      <main>
        <div className="sm:px-2">
          <h1 className="px-4 pt-5 text-2xl text-left text-teal-500 font-bold sm:text-3xl">
            Software developer
          </h1>
          <p className="px-4 mt-8 text-lg sm:mt-8">This is WIP</p>
        </div>
      </main>
      <aside>
        <h2>My Posts</h2>
      </aside>
    </div>
  );
}
