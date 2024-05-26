import { copyFile, TemporaryDirectoryPath } from "react-native-fs";
import { RNFFmpeg } from "react-native-ffmpeg";
import { Platform } from "react-native";

interface ConverterEngine {
  convert(arg0: string): Promise<string>;
}

class IOSVideoConverter implements ConverterEngine {
  async convert(videoUri: string): Promise<string> {
    const fileName = Date.now().toString();

    const outputVideoName = `${fileName}.mp4`;
    const outputVideoUri = `file://${TemporaryDirectoryPath}/${outputVideoName}`;

    try {
      await RNFFmpeg.execute(`-y -i ${videoUri} ${outputVideoUri}`);
    } catch (e) {
      throw new Error("Failed to convert the video");
    }

    return outputVideoUri;
  }
}

class AndroidVideoConverter implements ConverterEngine {
  async convert(videoUri: string): Promise<string> {
    let fileUri = videoUri;

    if (videoUri.startsWith("content://")) {
      try {
        fileUri = await this.createFileUriFromContentUri(videoUri);
      } catch (e) {
        throw new Error("Failed to create file uri from content uri");
      }
    }

    const fileName = Date.now().toString();

    const outputVideoName = `${fileName}.mp4`;
    const outputVideoUri = `file://${TemporaryDirectoryPath}/${outputVideoName}`;

    try {
      await RNFFmpeg.execute(`-y -i ${fileUri} ${outputVideoUri}`);
    } catch (e) {
      throw new Error("Failed to convert the video");
    }

    return outputVideoUri;
  }

  async createFileUriFromContentUri(contentUri: string): Promise<string> {
    const fileUri = contentUri.replace(
      "com.android.providers.media.documents/document/video%3A",
      "media/external/video/media/"
    );
    const uriComponents = fileUri.split("/");
    const fileName = uriComponents[uriComponents.length - 1];
    const newFilePath = `${TemporaryDirectoryPath}/${fileName}`;
    await copyFile(contentUri, newFilePath);

    return `file://${newFilePath}`;
  }
}

export class VideoConverterFactory {
  getConverterInstance(): ConverterEngine {
    if (Platform.OS === "android") {
      return new AndroidVideoConverter();
    } else {
      return new IOSVideoConverter();
    }
  }
}
