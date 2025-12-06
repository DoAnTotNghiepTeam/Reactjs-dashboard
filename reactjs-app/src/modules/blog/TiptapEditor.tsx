"use client";
// \`\`\`tsx file="components/TiptapEditor.tsx"
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  BlockOutlined,
  UndoOutlined,
  RedoOutlined,
  PictureOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Popconfirm } from "antd";
import type React from "react";
import { forwardRef, useEffect, useRef } from "react";
import { createImageUploadHandler } from "./imageUtils";

interface MenuBarProps {
  editor: any; // TipTap editor instance
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (editor.isActive("image")) {
      editor.chain().focus().deleteSelection().run();
    }
  };

  const handleFileChange = createImageUploadHandler(editor, 5);

  const menuItems = [
    {
      icon: <BoldOutlined />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      tooltip: "Bold",
    },
    {
      icon: <ItalicOutlined />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      tooltip: "Italic",
    },
    {
      icon: <StrikethroughOutlined />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      tooltip: "Strike",
    },
    {
      icon: <CodeOutlined />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      tooltip: "Code",
    },
    {
      type: "divider",
    },
    {
      icon: <UnorderedListOutlined />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      tooltip: "Bullet List",
    },
    {
      icon: <OrderedListOutlined />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      tooltip: "Ordered List",
    },
    {
      icon: <BlockOutlined />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      tooltip: "Blockquote",
    },
    {
      type: "divider",
    },
    {
      icon: <PictureOutlined />,
      action: handleImageUpload,
      isActive: false,
      tooltip: "Thêm ảnh",
    },
    ...(editor.isActive("image")
      ? [
          {
            icon: <DeleteOutlined />,
            action: handleRemoveImage,
            isActive: false,
            tooltip: "Xóa ảnh đã chọn",
            danger: true,
          },
        ]
      : []),
    {
      type: "divider",
    },
    {
      icon: <UndoOutlined />,
      action: () => editor.chain().focus().undo().run(),
      tooltip: "Undo",
      disabled: !editor.can().undo(),
    },
    {
      icon: <RedoOutlined />,
      action: () => editor.chain().focus().redo().run(),
      tooltip: "Redo",
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        padding: "8px",
        border: "1px solid #d9d9d9",
        borderBottom: "none",
        borderRadius: "6px 6px 0 0",
        background: "#fafafa",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {menuItems.map((item, index) =>
        item.type === "divider" ? (
          <div
            key={index}
            style={{
              width: "1px",
              backgroundColor: "#d9d9d9",
              margin: "0 4px",
            }}
          />
        ) : (
          <Tooltip title={item.tooltip} key={index}>
            {item.danger ? (
              <Popconfirm
                title="Xóa ảnh này?"
                description="Bạn có chắc chắn muốn xóa ảnh đã chọn?"
                onConfirm={item.action}
                okText="Xóa"
                cancelText="Hủy"
                okType="danger"
              >
                <Button
                  icon={item.icon}
                  type="default"
                  size="small"
                  danger
                  disabled={item.disabled}
                />
              </Popconfirm>
            ) : (
              <Button
                icon={item.icon}
                onClick={item.action}
                type={item.isActive ? "primary" : "default"}
                size="small"
                disabled={item.disabled}
              />
            )}
          </Tooltip>
        )
      )}
    </div>
  );
};

interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

// Define the component using forwardRef
const TiptapEditor = forwardRef<HTMLDivElement, TiptapEditorProps>(
  ({ value = "", onChange, onBlur }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Image.configure({
          inline: true,
          allowBase64: true,
          HTMLAttributes: {
            style:
              "max-width: 100%; height: auto; border-radius: 4px; cursor: pointer;",
          },
        }),
      ],
      content: value,
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
      onBlur: () => {
        if (onBlur) {
          onBlur();
        }
      },
      editorProps: {
        attributes: {
          class: "tiptap-editor",
        },
      },
    });

    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }, [value, editor]);

    return (
      <div
        style={{ border: "1px solid #d9d9d9", borderRadius: "6px" }}
        ref={ref}
      >
        {editor && <MenuBar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    );
  }
);

TiptapEditor.displayName = "TiptapEditor";

export default TiptapEditor;
