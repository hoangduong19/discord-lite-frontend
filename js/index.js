import { initServerUI, loadAndRenderServers } from "./ui/server-ui.js";
import { initChannelUI, loadAndRenderChannels } from "./ui/channel-ui.js";
import { initMessageController, openChannel } from "./websocket/message-controller.js";
import { initUserPanel } from "./ui/user-ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    initServerUI();
    initChannelUI();
    initMessageController();
    initUserPanel();
    
    try {
        await loadAndRenderServers();
    } catch {
        alert("Không load được server");
    }
    window.openChannel = openChannel;
});