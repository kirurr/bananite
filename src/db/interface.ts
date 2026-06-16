export interface Database {
	add: (name: string) => void;
	remove: (name: string) => void;
	getAll: () => string[];
}
