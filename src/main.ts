import "./style.css";
import App from "./app.svelte";
import { mount } from "svelte";
import { loadLocalData } from "@/util/data-manager.svelte";

loadLocalData();
mount(App, { target: document.body });
