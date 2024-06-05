export class Image {
  id: string;
  url: string;

  constructor(id: string, url: string) {
    this.id = id;
    this.url = url;
  }

  getId(): string {
    return this.id;
  }

  getUrl(): string {
    return this.url;
  }

  setId(id: string): void {
    this.id = id;
  }

  setUrl(url: string): void {
    this.url = url;
  }
}
