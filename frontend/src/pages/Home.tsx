import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Button className="text-lg">
        <a href="/code">Code</a>
      </Button>
    </div>
  )
}
