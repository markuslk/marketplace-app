import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getItem, itemQueryOptions } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { differenceInSeconds } from "date-fns";
import { Eye, Share } from "lucide-react";
import { useEffect, useState } from "react";
// import { z } from "zod";

export const Route = createFileRoute("/items/$id")({
	loader: async ({ params: { id } }) => await getItem(id),
	component: ItemComponent,
});

function ItemComponent() {
	const { id } = Route.useParams();
	const { data } = useSuspenseQuery(itemQueryOptions(id));
	const { item } = data;
	const [count, setCount] = useState(
		Number(item?.currentOfferPrice ? item?.currentOfferPrice : item?.startingPrice) + 1
	);
	const currentDateTime = new Date(Date.now());
	const auctionEndTime = new Date(item?.auctionEndsAt as string);
	const [auctionTimeLeft, setAuctionTimeLeft] = useState<number>(
		differenceInSeconds(auctionEndTime, currentDateTime)
	);
	const [remainingHours, setRemainingHours] = useState<number>(Math.floor(auctionTimeLeft / 3600) % 24);
	const [remainingMinutes, setRemainingMinutes] = useState<number>(Math.floor((auctionTimeLeft % 3600) / 60));
	const [remainingSeconds, setRemainingSeconds] = useState<number>(Math.floor(auctionTimeLeft % 60));

	useEffect(() => {
		if (auctionTimeLeft > 0) {
			const interval = setInterval(() => {
				setAuctionTimeLeft((prev) => prev - 1);
			}, 1000);

			setRemainingHours(Math.floor(auctionTimeLeft / 3600) % 24);
			setRemainingMinutes(Math.floor((auctionTimeLeft % 3600) / 60));
			setRemainingSeconds(Math.floor(auctionTimeLeft % 60));
			return () => clearInterval(interval);
		}
	}, [auctionTimeLeft]);

	function decrementBid() {
		if (count > Number(item?.currentOfferPrice) + 1) {
			setCount((count) => count - 1);
		}
	}

	function increaseBid() {
		if (count < Number(item?.buyNowPrice) - 1) {
			setCount((count) => count + 1);
		}
	}

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	};

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
				<div className="flex flex-col gap-4">
					<div className="bg-gray-200 px-2 py-6 rounded-md text-sm flex flex-col gap-6">
						<div className="text-center">
							<p className="text-base font-medium uppercase">End of auction in:</p>
							{auctionTimeLeft > 0 && remainingHours < 1 ? (
								<span className="font-semibold text-lg tracking-wide text-primary">
									{remainingMinutes}m {remainingSeconds}s
								</span>
							) : auctionTimeLeft > 0 ? (
								<span className="font-semibold text-lg tracking-wide text-primary">
									{remainingHours}h {remainingMinutes}m {remainingSeconds}s
								</span>
							) : (
								<span className="font-semibold uppercase text-lg tracking-wide">
									Auction is finished
								</span>
							)}
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
					{/* Make offer section */}
					<div className="bg-stone-200 rounded-md px-2 py-4 flex flex-col items-center">
						{/* Bid */}
						<div className="flex items-center flex-col">
							<h4>Make your offer:</h4>
							<div className="flex items-center py-4">
								<div
									onClick={decrementBid}
									className={buttonVariants({
										size: "icon",
										className: "rounded-none rounded-tl-md rounded-bl-md cursor-pointer",
									})}>
									-
								</div>
								<Input
									className="rounded-none border-none text-center focus-visible:ring-0 focus-visible:ring-offset-0"
									value={formatCurrency(count)}
									onChange={(e) => e.target.value}
								/>
								<div
									onClick={increaseBid}
									className={buttonVariants({
										size: "icon",
										className: "rounded-none rounded-tr-md rounded-br-md cursor-pointer",
									})}>
									+
								</div>
							</div>
							<div className={buttonVariants({ className: "cursor-pointer" })}>Make your bid</div>
						</div>
						{/* Buy now */}
						<p className="py-4">or</p>
						<div
							className={buttonVariants({
								className: "cursor-pointer",
							})}>{`Buy now for ${item?.buyNowPrice} €`}</div>
					</div>
					<div className="flex flex-col gap-4">
						<div>{`Seller: First Name`}</div>
						<p>{`Description: ${item?.description}`}</p>
					</div>
				</div>
			</div>
		</section>
	);
}

// const schema = z.number().refine(
// 	(n) => {
// 		return n.toString().split(".")[1].length <= 2;
// 	},
// 	{ message: "Max precision is 2 decimal places" }
// );
