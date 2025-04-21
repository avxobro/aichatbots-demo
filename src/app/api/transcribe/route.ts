import { NextRequest, NextResponse } from 'next/server';
import { Deepgram } from '@deepgram/sdk';

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

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY || '');
    
    const response = await deepgram.transcription.preRecorded(
      {
        buffer,
        mimetype: audioFile.type,
      },
      {
        smart_format: true,
        model: 'nova',
      }
    );

    const transcript = response.results?.channels[0]?.alternatives[0]?.transcript || '';
    
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error in transcription API:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
