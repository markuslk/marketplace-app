import { getItem, itemQueryOptions } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Share } from "lucide-react";

export const Route = createFileRoute("/items/$id")({
	loader: ({ params: { id } }) => getItem(id),
	component: ItemComponent,
});

function ItemComponent() {
	const { id } = Route.useParams();
	const { data } = useSuspenseQuery(itemQueryOptions(id));
	const { item } = data;
	return (
		<section className="px-4 py-6">
			<div className="flex flex-col gap-2 border-b pb-4 md:pb-6">
				<h3 className="text-2xl font-medium tracking-wide">{item?.title}</h3>
				<div className="flex gap-4 items-center text-xs text-gray-400">
					<h5 className="uppercase ">{`Item id: ${item?.id}`}</h5>
					<p className="flex gap-1 items-center">
						<Eye className="size-5" />
						Watch
					</p>
					<p className="flex gap-1 items-center">
						<Share className="size-5" />
						Share
					</p>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 items-start mt-6 text-gray-500">
				{/* Image */}
				<div className="relative aspect-square overflow-hidden rounded-md">
					<img src="/images/laptop-1.jpg" className="h-full w-full object-cover object-center" />
				</div>
				{/* Details */}
				<div className="flex flex-col-reverse md:flex-col gap-4">
					<div className="flex flex-col gap-4">
						<div>{`Seller: First Name`}</div>
						<p>{`Description: ${item?.description}`}</p>
					</div>
					<div className="bg-gray-200 px-2 py-6 rounded-md text-sm flex flex-col gap-6">
						<div className="text-center">
							<p className="text-base font-medium uppercase">End of auction in:</p>
							<p className="text-lg font-bold text-primary">3 hours 27 minutes 15 seconds</p>
						</div>
						<div className="text-center">
							<p className="text-base font-medium uppercase">Starting price:</p>
							<p className="text-xl font-bold text-primary">{item?.startingPrice} €</p>
						</div>
						<div className="text-center">
							<p className="text-base font-medium uppercase">Current offer:</p>
							<p className="text-xl font-bold text-primary">
								{item?.currentOfferPrice ? `${item?.currentOfferPrice} €` : "-"}
							</p>
							<div></div>
						</div>
						<div className="text-center">
							<p className="text-base font-medium uppercase">Buy now:</p>
							<p className="text-xl font-bold text-primary">
								{item?.buyNowPrice ? `${item?.buyNowPrice} €` : "-"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
