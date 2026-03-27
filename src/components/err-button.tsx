export function ErrButton() {
  return (
    <button
      className="z-100"
      onClick={() => {
        console.log("Breaking the world...");
        throw new Error('This is your first error!');
      }}
    >
      Break the world
    </button>
  );
}