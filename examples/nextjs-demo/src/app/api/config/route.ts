import { load } from '@nexo-labs/pkl';
import type { config } from '../../../generated/config';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Load configuration at request time (SSR/API)
    const config = await load(path.resolve('./config.pkl'));
    
    return NextResponse.json({
      success: true,
      config,
      loadedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}