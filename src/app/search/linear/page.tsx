export default function LinearSearchPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Linear Search</h1>
      <p className="mb-4 text-muted-foreground">
        Linear Search sequentially checks each element of the list until a match is found or the list ends.
        Time: O(n). Space: O(1).
      </p>
      <p className="text-sm text-muted-foreground">Interactive visualizer coming soon.</p>
    </div>
  );
}
