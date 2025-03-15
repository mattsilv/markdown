import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Define path to the kaizen.md file
    const filePath = path.join(process.cwd(), 'samples', 'kaizen.md');
    
    // Read the file content
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Return the content as a text response
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/markdown',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error reading kaizen.md file:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to read kaizen.md file' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}