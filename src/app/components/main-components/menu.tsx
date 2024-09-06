export default function Menu(props: any) {
  return (
    <div className="flex gap-2">
      <button>Pencil</button>
      <span>Color</span>
      <button>PickColor</button>
      <button>Undo</button>
      <button>Upload</button>
      <button>Exit</button>
    </div>
  );
}
