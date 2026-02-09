import { initServerUI, loadAndRenderServers } from "./ui/server-ui.js";
import { initChannelUI, loadAndRenderChannels } from "./ui/channel-ui.js";
import { initMessageController, openChannel } from "./websocket/message-controller.js";

document.addEventListener("DOMContentLoaded", async () => {
    initServerUI();
    initChannelUI();
    initMessageController();
    try {
        await loadAndRenderServers();
    } catch {
        alert("Không load được server");
    }
    window.openChannel = openChannel;
});