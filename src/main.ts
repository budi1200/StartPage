import "./style.css";
import App from "./app.svelte";
import { mount } from "svelte";
import { loadLocalData } from "@/util/data-manager.svelte";
import { loadQuotes } from "@/api/readwise.svelte";

loadLocalData();
loadQuotes();
mount(App, { target: document.body });
