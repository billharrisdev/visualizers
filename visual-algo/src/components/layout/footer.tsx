export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto p-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Visual-Algo. All rights reserved.</p>
      </div>
    </footer>
  )
}
