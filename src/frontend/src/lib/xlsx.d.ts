declare module "xlsx" {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [key: string]: WorkSheet };
  }

  export interface WorkSheet {
    [key: string]: CellObject | Range | undefined;
    "!ref"?: string;
    "!merges"?: Range[];
  }

  export interface CellObject {
    v?: string | number | boolean | Date;
    t?: string;
    f?: string;
    r?: string;
    h?: string;
    c?: Comment[];
    z?: string;
    l?: Hyperlink;
    s?: unknown;
    w?: string;
  }

  export interface Range {
    s: CellAddress;
    e: CellAddress;
  }

  export interface CellAddress {
    c: number;
    r: number;
  }

  export interface Comment {
    a: string;
    t: string;
  }

  export interface Hyperlink {
    Target: string;
    Tooltip?: string;
  }

  export interface ParsingOptions {
    type?: string;
    codepage?: number;
    raw?: boolean;
    cellHTML?: boolean;
    cellFormula?: boolean;
    sheetStubs?: boolean;
    sheetRows?: number;
    dense?: boolean;
    UTC?: boolean;
    WTF?: boolean;
    dateNF?: string;
    cellDates?: boolean;
    cellNF?: boolean;
    cellStyles?: boolean;
  }

  export function read(data: unknown, opts?: ParsingOptions): WorkBook;
  export function readFile(filename: string, opts?: ParsingOptions): WorkBook;

  export const utils: {
    sheet_to_json<T = unknown>(
      worksheet: WorkSheet,
      opts?: {
        raw?: boolean;
        header?: number | string | string[];
        defval?: unknown;
        blankrows?: boolean;
        range?: string | number | Range;
        dateNF?: string;
        skipHidden?: boolean;
      },
    ): T[];
    json_to_sheet<T = unknown>(
      data: T[],
      opts?: {
        header?: string[];
        skipHeader?: boolean;
        origin?: string | number | CellAddress;
        dateNF?: string;
        cellDates?: boolean;
        raw?: boolean;
      },
    ): WorkSheet;
    book_new(): WorkBook;
    book_append_sheet(
      workbook: WorkBook,
      worksheet: WorkSheet,
      name?: string,
    ): void;
    encode_cell(cell: CellAddress): string;
    decode_cell(address: string): CellAddress;
    encode_range(range: Range): string;
    decode_range(address: string): Range;
    aoa_to_sheet<T = unknown>(data: T[][]): WorkSheet;
    sheet_to_csv(
      worksheet: WorkSheet,
      opts?: { FS?: string; RS?: string },
    ): string;
  };

  export function writeFile(
    workbook: WorkBook,
    filename: string,
    opts?: unknown,
  ): void;
  export function write(workbook: WorkBook, opts?: unknown): unknown;
}
