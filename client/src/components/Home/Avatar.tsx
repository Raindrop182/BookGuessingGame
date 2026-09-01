import { useRef, useState, useEffect } from "react";

import { useUpdateUser } from "../Utils/UpdateUser";

type AvatarProps = {
  color: string;
};

function Avatar({ color }: AvatarProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const { changeAvatarColor } = useUpdateUser();
  const [localColor, setLocalColor] = useState(color);

  useEffect(()=>{
    setLocalColor(color);
  }, [color]);

  useEffect(() => {
    if (localColor === color) return;

    const timer = setTimeout(() => {
      changeAvatarColor(localColor);
    }, 400);

    return () => clearTimeout(timer);
  }, [localColor, color, changeAvatarColor]);

  return (
    <div>
      <div
        className="avatar-circle"
        style={{ backgroundColor: localColor }}
        onClick={() => {colorInputRef.current?.click()}}
      />
      <input
        ref={colorInputRef}
        type="color"
        value={localColor}
        onChange={(e) => setLocalColor(e.target.value)}
        className="hidden-color-input"
      />
    </div>
  );
}

export default Avatar;
