import { createFileRoute, Link } from "@tanstack/react-router";
// import { toast } from "sonner";
import { itemsQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { buttonVariants } from "@/components/ui/button";
import { Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
	component: Component,
});

function Component() {
	const { isPending, error, data: items } = useQuery(itemsQueryOptions);

	if (error) return "An error has occured:" + error.message;

	return (
		<div className="px-4 py-6 lg:py-10">
			<div className="text-2xl md:text-4xl font-semibold pb-4">Current offers:</div>
			{isPending && <div>Loading items...</div>}
			<div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 lg:gap-6 xl:gap-8">
				{items?.map((item) => (
					<div className="flex flex-col rounded-md border" key={item.id}>
						<div className="relative aspect-square overflow-hidden rounded-md">
							<img src="/images/laptop-1.jpg" className="h-full w-full object-cover object-center" />
						</div>
						<div className="px-2 py-3 lg:p-4 text-center flex flex-col flex-grow">
							<h4 className="text-lg font-semibold">{item.title}</h4>
							<div className="py-1 bg-gray-200 rounded-full my-2">
								Auction ends in - <span className="font-semibold">3h 15m 23s</span>
							</div>
							<div className="mb-4">
								<div className="flex gap-2 justify-around">
									<div className="flex flex-col items-center">
										<span>Starting price</span>
										<span className="font-semibold">{item.startingPrice}€</span>
									</div>
									<div className="flex flex-col items-center">
										<span>Current bid</span>
										{item.currentOfferPrice ? (
											<span className="font-semibold">{`${item.currentOfferPrice} €`}</span>
										) : (
											"-"
										)}
									</div>
								</div>
								{parseInt(item?.buyNowPrice) > 50 ? (
									<div className="flex flex-col items-center mt-2">
										<p className="">Buy now</p>
										<p className="font-semibold text-base">{item.buyNowPrice}€</p>
									</div>
								) : null}
							</div>
							<div className="flex gap-2 justify-between mt-auto">
								<Link
									to="/items/$id"
									params={{ id: item.id }}
									className={buttonVariants({
										variant: "outline",
										className: "flex gap-2 w-full",
										size: "sm",
									})}>
									<Eye className="size-5" />
									<span>View item</span>
								</Link>
								<div
									onClick={(e) => e.preventDefault()}
									className={buttonVariants({
										variant: "secondary",
										className: "flex gap-2 w-full relative z-10 cursor-pointer select-none",
										size: "sm",
									})}>
									<Heart className="size-5" />
									<span>Favourite</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
