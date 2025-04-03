import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className='container mx-auto py-10 px-4 min-h-screen'>
      <h1 className='text-3xl font-bold mb-8'>Create Azure DevOps User Story</h1>
      <div className='flex w-full space-x-4'>
        {/* First Card */}
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Card 1 Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Content for the first card goes here.</p>
          </CardContent>
          <CardFooter>
            <p>Footer of the first card.</p>
          </CardFooter>
        </Card>

        {/* Second Card */}
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Card 2 Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Content for the second card goes here.</p>
          </CardContent>
          <CardFooter>
            <p>Footer of the second card.</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
