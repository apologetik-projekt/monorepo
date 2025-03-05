export function Debug({ value }: { value: any }) {
  return <pre className="overflow-hidden">{JSON.stringify(value, null, 2)}</pre>
}
