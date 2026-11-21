import Link from "next/link";

export default function NotFound() {
  return <main className="container page-hero"><h1>Page not found</h1><p>This page does not exist. Check the address or start a new message check.</p><Link className="button" href="/">Check a message</Link></main>;
}
