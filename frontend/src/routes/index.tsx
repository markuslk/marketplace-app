import { createFileRoute, Link } from "@tanstack/react-router";
// import { toast } from "sonner";
import { itemsQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
	component: Component,
});

function Component() {
	const { isPending, error, data: items } = useQuery(itemsQueryOptions);

	if (error) return "An error has occured:" + error.message;

	return (
		<div className="p-8 lg:py-20">
			<div className="text-2xl md:text-4xl font-semibold pb-4">Current offers:</div>
			{isPending && <div>Loading items...</div>}
			<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 md:gap-6 lg:gap-10">
				{items?.map((item) => (
					<Link to="/items/$id" params={{ id: item.id }} className="flex flex-col" key={item.id}>
						<div className="relative aspect-square overflow-hidden rounded-md">
							<img src="/images/laptop-1.jpg" className="h-full w-full object-cover object-center" />
						</div>
						<div className="p-2 flex-1">
							<h4 className="text-lg font-semibold">{item.title}</h4>
							<div>
								Starting price - <span className="font-semibold">{item.startingPrice}€</span>
							</div>
							{item.currentOfferPrice && (
								<div>
									Current highest bid -{" "}
									<span className="font-semibold">{item.currentOfferPrice}€</span>
								</div>
							)}
							<div>
								Buy now for - <span className="font-semibold">{item.buyNowPrice}€</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
