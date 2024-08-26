import { Bid, Item } from "@/components/AuctionItem";
import { type ApiRoutes } from "@server/app";
import { CreateBid, CreateItem } from "@server/shared-types";

import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
	const res = await api.user.$get();
	if (!res.ok) {
		throw new Error("Server error");
	}
	const data = await res.json();
	return data;
}

export const userQueryOptions = queryOptions({
	queryKey: ["get-current-user"],
	queryFn: getCurrentUser,
});

async function getPublishedItems() {
	const res = await api.items.$get();
	if (!res.ok) {
		throw new Error("Server error");
	}
	const data = await res.json();
	return data;
}

export const itemsQueryOptions = queryOptions({
	queryKey: ["get-published-items"],
	queryFn: getPublishedItems,
	staleTime: 1000 * 60 * 5,
});

export async function getItem(id: string) {
	const res = await api.items[":id{[0-9]+}"].$get({
		param: { id },
	});

	if (!res.ok) {
		throw new Error("Server error getting item");
	}

	return await res.json();
}

export const itemQueryOptions = (id: string) => {
	return queryOptions<{ item?: Item }>({
		queryKey: ["get-item", id],
		queryFn: async () => {
			const data = await getItem(id);
			if (!data) {
				throw new Error("Error getting item");
			}
			return data;
		},
	});
};

export async function createBid({ value, id }: { value: CreateBid; id: string }) {
	const res = await api.items[":id{[0-9]+}"].bids.$post({ json: value, param: { id } });

	if (!res.ok) {
		throw new Error("Server error creating new bid");
	}
	const newBid = await res.json();
	return newBid;
}

export async function getBids(id: string) {
	const res = await api.items[":id{[0-9]+}"].bids.$get({
		param: { id },
	});
	if (!res.ok) {
		throw new Error("Server error getting bids for current item");
	}

	return await res.json();
}

export const itemBidsQueryOptions = (id: string) => {
	return queryOptions<Bid[]>({
		queryKey: ["get-bids", id],
		queryFn: async () => {
			const data = await getBids(id);
			if (!data) {
				throw new Error("Error getting bids for item");
			}
			return data;
		},
	});
};

export async function createItem({ value }: { value: CreateItem }) {
	const res = await api.items.$post({ json: value });
	if (!res.ok) {
		throw new Error("Server error creating new item");
	}
	const newItem = await res.json();
	return newItem;
}
