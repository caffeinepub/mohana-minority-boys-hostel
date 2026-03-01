import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export function useStorageUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });

  const { identity } = useInternetIdentity();
  const { actor: _actor } = useActor();

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      if (!identity) {
        setState((prev) => ({ ...prev, error: "Not authenticated" }));
        return null;
      }

      setState({ uploading: true, progress: 0, error: null });

      try {
        const config = await loadConfig();
        const configAny = config as unknown as Record<
          string,
          string | undefined
        >;
        const backendHost = configAny.backend_host;
        const agent = await HttpAgent.create({
          identity,
          host: backendHost || "https://icp-api.io",
        });

        const backendCanisterId = configAny.backend_canister_id ?? "";
        const projectId = configAny.project_id ?? "";
        const storageGatewayUrl =
          configAny.storage_gateway_url ?? "https://storage.caffeine.ai";

        const storageClient = new StorageClient(
          "gallery",
          storageGatewayUrl,
          backendCanisterId,
          projectId,
          agent,
        );

        const bytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (pct) => {
          setState((prev) => ({ ...prev, progress: pct }));
        });

        const url = await storageClient.getDirectURL(hash);
        setState({ uploading: false, progress: 100, error: null });
        return url;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setState({ uploading: false, progress: 0, error: message });
        return null;
      }
    },
    [identity],
  );

  return { ...state, uploadFile };
}
