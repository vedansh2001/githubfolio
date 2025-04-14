"use client";
import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

interface AlertCardProps {
  type?: "error" | "success" | "info";
  message: string;
  onClose?: () => void;
}

const iconMap = {
  error: <AlertTriangle className="text-red-600" size={20} />,
  success: <CheckCircle className="text-green-600" size={20} />,
  info: <Info className="text-blue-600" size={20} />,
};

const bgColorMap = {
  error: "bg-red-100 border-red-300",
  success: "bg-green-100 border-green-300",
  info: "bg-blue-100 border-blue-300",
};

const AlertCard: React.FC<AlertCardProps> = ({
  type = "info",
  message,
  onClose,
}) => {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-md border ${bgColorMap[type]} relative`}
    >
      <div className="mt-1">{iconMap[type]}</div>
      <div className="flex-1 text-sm text-gray-800">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertCard;
