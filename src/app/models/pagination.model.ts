export class Pagination {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;

  constructor(
    totalElements: number,
    totalPages: number,
    size: number,
    number: number,
    first: boolean,
    last: boolean,
    numberOfElements: number
  ) {
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    this.size = size;
    this.number = number;
    this.first = first;
    this.last = last;
    this.numberOfElements = numberOfElements;
  }

  public getTotalElements(): number {
    return this.totalPages;
  }

  public setTotalElements(totalElements: number) {
    this.totalElements = totalElements;
  }

  public getTotalPages(): number {
    return this.totalPages;
  }

  public setTotalPages(totalPages: number) {
    this.totalPages = totalPages;
  }

  public getSize(): number {
    return this.size;
  }

  public setSize(size: number) {
    this.size = size;
  }

  public getNumber(): number {
    return this.number;
  }

  public setNumber(number: number) {
    this.number = number;
  }

  public isFirst(): boolean {
    return this.first;
  }

  public setFirst(first: boolean) {
    this.first = first;
  }

  public isLast(): boolean {
    return this.last;
  }

  public setLast(last: boolean) {
    this.last = last;
  }

  public getNumberOfElements(): number {
    return this.numberOfElements;
  }

  public setNumberOfElements(numberOfElements: number) {
    this.numberOfElements = numberOfElements;
  }
}
