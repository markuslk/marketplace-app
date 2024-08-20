import { createFileRoute } from "@tanstack/react-router";
import AuctionItem from "@/components/AuctionItem";
import { itemsQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import CreateItem from "@/components/CreateItem";

export const Route = createFileRoute("/")({
	component: Component,
});

function Component() {
	const { isPending, error, data: items } = useQuery(itemsQueryOptions);

	if (error) return "An error has occured:" + error.message;

	return (
		<div className="px-4 py-6 lg:py-10">
			<div>
				<CreateItem />
			</div>
			<div className="text-2xl md:text-4xl font-semibold pb-4">Current offers:</div>
			{isPending && <div>Loading items...</div>}
			<div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 lg:gap-6 xl:gap-8">
				{items?.map((item) => <AuctionItem key={item.id} item={item} />)}
			</div>
		</div>
	);
}
