import React, { useState } from "react";
import { X } from "lucide-react";
import { useModalStore } from "../../../../stores/modalStore";
import { useWorkflowStore } from "../../../../stores/workflowStore";

interface DeployNFTConfig {
  nftName: string;
  symbol: string;
  nftImageUrl: string;
}

export default function DeployNFTModal() {
  const { isOpen, selectedNode, modalType, closeModal } = useModalStore();
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const [config, setConfig] = useState<DeployNFTConfig>({
    nftName: "",
    symbol: "",
    nftImageUrl: "",
  });

  if (!isOpen || !selectedNode || modalType !== "deployNFT") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNode(selectedNode.id, {
      ...selectedNode.data,
      config: {
        name: config.nftName,
        symbol: config.symbol,
        baseURI: config.nftImageUrl,
      },
    });
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] text-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-lg font-semibold">Configure Google Sheets</h2>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 mt-3">
                Enter NFT name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.nftName}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      nftName: e.target.value,
                    }))
                  }
                  className="w-full bg-[#3A3A3A] border-gray-600 rounded-md p-2 font-mono text-sm pr-10"
                  placeholder="Enter name here..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 mt-3">
                Enter Symbol here
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.symbol}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      symbol: e.target.value,
                    }))
                  }
                  className="w-full bg-[#3A3A3A] border-gray-600 rounded-md p-2 font-mono text-sm pr-10"
                  placeholder="Enter symbol here..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 mt-3">
                Enter Image Url
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.nftImageUrl}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      nftImageUrl: e.target.value,
                    }))
                  }
                  className="w-full bg-[#3A3A3A] border-gray-600 rounded-md p-2 font-mono text-sm pr-10"
                  placeholder="Enter image url here..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
