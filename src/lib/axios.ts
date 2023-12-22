import { configuration } from "@/constants/configs";
import axiosInstance from "axios";

export const axios = axiosInstance.create({
  baseURL: configuration.site.siteUrl,
});
