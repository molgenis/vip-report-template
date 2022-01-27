import { InjectionKey } from "vue";
import { Api } from "../api/Api";

export const ApiKey: InjectionKey<Api> = Symbol("ApiClient");
