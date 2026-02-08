import { initServerUI, loadAndRenderServers } from "./ui/server-ui.js";
import { initChannelUI, loadAndRenderChannels } from "./ui/channel-ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    initServerUI();
    initChannelUI();

    try {
        await loadAndRenderServers();
    } catch {
        alert("Không load được server");
    }
});