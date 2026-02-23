import { useState, useRef } from "react";
import { useUpdateUser } from "../Utils/UpdateUser";
type AvatarProps = {
  color: string;
};
function Avatar({ color }: AvatarProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const { changeAvatarColor } = useUpdateUser();

  const handleAvatarClick = () => {
    colorInputRef.current?.click();
  };

  return (
    <div>
      <div
        className="avatar-circle"
        style={{ backgroundColor: color }}
        onClick={handleAvatarClick}
      />
      <input
        ref={colorInputRef}
        type="color"
        value={color}
        onChange={(e) => changeAvatarColor(e.target.value)}
        className="hidden-color-input"
      />
    </div>
  );
}

export default Avatar;
