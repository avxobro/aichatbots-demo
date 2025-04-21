import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer via Uint8Array
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY || '');
    
    const response = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        smart_format: true,
        model: 'nova',
        mimetype: audioFile.type,
      }
    );

    const transcript = response.result?.results?.channels[0]?.alternatives[0]?.transcript || '';
    
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error in transcription API:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}




