"use client";

import { useState, useEffect } from "react";

export const useLiveTime = (timestamp: string | null | undefined, isOnline: boolean) => {
  const [liveText, setLiveText] = useState<string>("");

  useEffect(() => {
    if (isOnline || !timestamp) {
      setLiveText(isOnline ? "Đang hoạt động" : "Không hoạt động");
      return;
    }

    const updateLiveText = () => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) {
        setLiveText("Hoạt động vừa xong");
      } else if (diffInMinutes < 60) {
        setLiveText(`Hoạt động ${diffInMinutes} phút trước`);
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
          setLiveText(`Hoạt động ${diffInHours} giờ trước`);
        } else {
          const diffInDays = Math.floor(diffInHours / 24);
          if (diffInDays < 7) {
            setLiveText(`Hoạt động ${diffInDays} ngày trước`);
          } else {
            setLiveText(`Hoạt động ${date.toLocaleDateString("vi-VN")}`);
          }
        }
      }
    };

    // Update immediately
    updateLiveText();

    // Set up interval to update every minute
    const interval = setInterval(updateLiveText, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [timestamp, isOnline]);

  return liveText;
};

export const useFormattedLastSeen = (timestamp: string | null | undefined) => {
  const [formattedTime, setFormattedTime] = useState<string>("");

  useEffect(() => {
    if (!timestamp) {
      setFormattedTime("");
      return;
    }

    const updateFormattedTime = () => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) {
        setFormattedTime("vừa xong");
      } else if (diffInMinutes < 60) {
        setFormattedTime(`${diffInMinutes} phút trước`);
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
          setFormattedTime(`${diffInHours} giờ trước`);
        } else {
          const diffInDays = Math.floor(diffInHours / 24);
          if (diffInDays < 7) {
            setFormattedTime(`${diffInDays} ngày trước`);
          } else {
            setFormattedTime(date.toLocaleDateString("vi-VN"));
          }
        }
      }
    };

    // Update immediately
    updateFormattedTime();

    // Set up interval to update every minute
    const interval = setInterval(updateFormattedTime, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return formattedTime;
};
