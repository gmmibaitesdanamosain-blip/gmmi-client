import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Card,
  CardBody,
} from "@heroui/react";

interface SkeletonColumn {
  key: string;
  label: string;
  skeletonWidth?: string;
  skeletonHeight?: string;
  skeletonRounded?: string;
  /** Render multiple skeleton lines in one cell */
  lines?: { width: string; height: string }[];
  /** Render multiple skeletons in a row (e.g. action buttons) */
  inline?: { width: string; height: string }[];
}

interface SkeletonTableProps {
  columns: SkeletonColumn[];
  rows?: number;
  withCard?: boolean;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({
  columns,
  rows = 3,
  withCard = true,
}) => {
  const renderCell = (col: SkeletonColumn) => {
    if (col.lines) {
      return (
        <div className="space-y-2">
          {col.lines.map((line, idx) => (
            <Skeleton
              key={idx}
              className={`${line.width} ${line.height} rounded-md`}
            />
          ))}
        </div>
      );
    }

    if (col.inline) {
      return (
        <div className="flex gap-2">
          {col.inline.map((item, idx) => (
            <Skeleton
              key={idx}
              className={`${item.width} ${item.height} rounded-lg`}
            />
          ))}
        </div>
      );
    }

    return (
      <Skeleton
        className={`${col.skeletonWidth || "w-20"} ${col.skeletonHeight || "h-5"} ${col.skeletonRounded || "rounded-md"}`}
      />
    );
  };

  const table = (
    <Table aria-label="Loading...">
      <TableHeader>
        {columns.map((col) => (
          <TableColumn key={col.key}>{col.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <TableRow key={`skeleton-row-${rowIdx}`}>
            {columns.map((col) => (
              <TableCell key={col.key}>{renderCell(col)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (withCard) {
    return (
      <Card>
        <CardBody>{table}</CardBody>
      </Card>
    );
  }

  return table;
};

export default SkeletonTable;
