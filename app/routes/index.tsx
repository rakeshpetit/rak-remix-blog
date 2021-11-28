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
        <h1 className="pt-5 text-2xl text-left text-teal-500 font-bold sm:text-3xl">
          Software developer
        </h1>
        <p className="mt-8 text-lg sm:mt-8">This is WIP</p>
      </main>
      <aside>
        <h2>My Posts</h2>
      </aside>
    </div>
  );
}
