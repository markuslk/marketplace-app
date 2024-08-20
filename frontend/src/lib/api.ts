import { Item } from "@/components/AuctionItem";
import { type ApiRoutes } from "@server/app";
import { CreateItem } from "@server/shared-types";

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

export async function createItem({ value }: { value: CreateItem }) {
	const res = await api.items.$post({ json: value });
	if (!res.ok) {
		throw new Error("Server error creating new item");
	}
	const newItem = await res.json();
	return newItem;
}
