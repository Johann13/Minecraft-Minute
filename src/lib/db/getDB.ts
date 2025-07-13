import type {APIContext} from "astro";
import type {ActionAPIContext} from "astro:actions";
import {drizzle} from 'drizzle-orm/d1';
import {extractCFBinding} from "../utils/extractCFBinding.ts";

export function getDB(
  source: APIContext | ActionAPIContext | App.Locals | Env
) {
  const binding = extractCFBinding(source)
  return drizzle(binding.DB);
}
