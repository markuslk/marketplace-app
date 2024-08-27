import { Link } from "@tanstack/react-router";
import { differenceInMinutes } from "date-fns";
import { Eye, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";

export type Item = {
	id: number;
	description: string;
	userId: string;
	title: string;
	createdAt: string;
	auctionEndsAt: string;
	isPublished: boolean | null;
	startingPrice: string;
	currentOfferPrice: string | null;
	buyNowPrice: string | null;
	bids?: Bid[] | Bid;
};

export type Bid = {
	id: number;
	userId: string;
	createdAt: string;
	itemId: number;
	bidAmount: string;
};

const AuctionItem = ({ item }: { item: Item }) => {
	const currentDateTime = new Date(Date.now());
	const auctionEndTime = new Date(item.auctionEndsAt);

	const [auctionTimeLeftInMinutes, setauctionTimeLeftInMinutes] = useState<number>(
		differenceInMinutes(auctionEndTime, currentDateTime)
	);
	const [remainingMinutes, setRemainingMinutes] = useState<number>(auctionTimeLeftInMinutes);

	useEffect(() => {
		if (auctionTimeLeftInMinutes > 0) {
			const interval = setInterval(() => {
				setauctionTimeLeftInMinutes((prev) => prev - 1);
			}, 1000 * 60);

			setRemainingMinutes(auctionTimeLeftInMinutes);
			return () => clearInterval(interval);
		}
	}, [auctionTimeLeftInMinutes]);

	return (
		<div className="flex flex-col rounded-md border" key={item.id}>
			<div className="relative aspect-square overflow-hidden rounded-t-md">
				<img src="/images/laptop-1.jpg" className="h-full w-full object-cover object-center" />
			</div>
			<div className="px-2 py-3 lg:p-4 text-center flex flex-col flex-grow">
				<h4 className="text-lg font-semibold">{item.title}</h4>
				<div className="py-1 bg-gray-200 rounded-full my-2">
					{remainingMinutes > 90 ? (
						<>
							<span>Auction ends in &gt; </span>
							<span className="font-semibold">90min</span>
						</>
					) : remainingMinutes > 0 && remainingMinutes <= 90 ? (
						<>
							<span>Auction ends in </span>
							<span className="font-semibold">{remainingMinutes}min</span>
						</>
					) : (
						<span className="font-semibold uppercase">Auction is finished</span>
					)}
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
								<span className="font-semibold">{`${item.currentOfferPrice}€`}</span>
							) : (
								"-"
							)}
						</div>
					</div>
					{item?.buyNowPrice ? (
						<div className="flex flex-col items-center mt-2">
							<p className="">Buy now</p>
							<p className="font-semibold text-base">{item.buyNowPrice}€</p>
						</div>
					) : null}
				</div>
				<div className="flex gap-2 justify-between mt-auto">
					<Link
						to="/items/$id"
						params={{ id: item.id.toString() }}
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
	);
};
export default AuctionItem;
