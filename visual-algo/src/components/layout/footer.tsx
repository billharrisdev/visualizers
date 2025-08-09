export default function Footer() {
  return (
    <footer className="bg-muted py-6">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Visual-Algo. All rights reserved.</p>
      </div>
    </footer>
  )
}
