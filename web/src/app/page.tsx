"use client";

import { useState, useCallback, FormEvent, useEffect } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Bookmark {
	id: string;
	url: string;
	title: string;
	favicon: string;
	domain: string;
	collectionId: string | null;
	addedAt: number;
	loading: boolean;
}

interface Collection {
	id: string;
	name: string;
}

// ─── Seed data ─────────────────────────────────────────────────────────────────

const fav = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const INIT_COLLECTIONS: Collection[] = [
	{ id: "reading", name: "Reading" },
	{ id: "design", name: "Design" },
	{ id: "dev", name: "Development" },
];

const INIT_BOOKMARKS: Bookmark[] = [
	{
		id: "bk-1",
		url: "https://linear.app",
		title: "Linear — Plan and build products",
		favicon: fav("linear.app"),
		domain: "linear.app",
		collectionId: "dev",
		addedAt: Date.now() - 86400000 * 5,
		loading: false,
	},
	{
		id: "bk-2",
		url: "https://vercel.com",
		title: "Vercel — Deploy web projects",
		favicon: fav("vercel.com"),
		domain: "vercel.com",
		collectionId: "dev",
		addedAt: Date.now() - 86400000 * 4,
		loading: false,
	},
	{
		id: "bk-3",
		url: "https://figma.com",
		title: "Figma — Collaborative design tool",
		favicon: fav("figma.com"),
		domain: "figma.com",
		collectionId: "design",
		addedAt: Date.now() - 86400000 * 2,
		loading: false,
	},
	{
		id: "bk-4",
		url: "https://rauno.me",
		title: "Rauno Freiberg — Design engineer",
		favicon: fav("rauno.me"),
		domain: "rauno.me",
		collectionId: "design",
		addedAt: Date.now() - 86400000,
		loading: false,
	},
	{
		id: "bk-5",
		url: "https://maggieappleton.com",
		title: "Maggie Appleton — Digital garden",
		favicon: fav("maggieappleton.com"),
		domain: "maggieappleton.com",
		collectionId: "reading",
		addedAt: Date.now() - 3600000 * 3,
		loading: false,
	},
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getDomain(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
}

function normalizeUrl(url: string): string {
	const t = url.trim();
	if (!t.startsWith("http://") && !t.startsWith("https://")) return "https://" + t;
	return t;
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function GridIcon() {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
			<rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
			<rect x="7.5" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
			<rect x="1" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
			<rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
		</svg>
	);
}

function BookIcon() {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
			<path d="M2 2C2 1.45 2.45 1 3 1h7c.55 0 1 .45 1 1v9.5L6.5 9 2 11.5V2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
		</svg>
	);
}

function PenIcon() {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
			<path d="M9 1.5l2.5 2.5L4 11.5H1.5V9L9 1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
		</svg>
	);
}

function CodeIcon() {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
			<path d="M4 3.5L1.5 6.5 4 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M9 3.5L11.5 6.5 9 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M7.5 2l-2 9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
		</svg>
	);
}

function PlusIcon() {
	return (
		<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
			<path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		</svg>
	);
}

function MiniEditIcon() {
	return (
		<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
			<path d="M7.5 1.5l2 2L3 10H1V8L7.5 1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
		</svg>
	);
}

function ExternalLinkIcon() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
			<path d="M4.5 2H2.5C1.95 2 1.5 2.45 1.5 3v6.5c0 .55.45 1 1 1H9c.55 0 1-.45 1-1V7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
			<path d="M7 1.5h3.5m0 0v3.5m0-3.5L5.5 6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function TrashIcon() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
			<path d="M1.5 3h9M4 3V2h4v1M3 3l.5 7.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5L9 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
		</svg>
	);
}

function ArrowRightIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
			<path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function getIcon(id: string) {
	switch (id) {
		case "reading":
			return <BookIcon />;
		case "design":
			return <PenIcon />;
		case "dev":
			return <CodeIcon />;
		default:
			return <GridIcon />;
	}
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Home() {
	const [collections, setCollections] = useState<Collection[]>(INIT_COLLECTIONS);
	const [bookmarks, setBookmarks] = useState<Bookmark[]>(INIT_BOOKMARKS);
	const [activeCol, setActiveCol] = useState<string | null>(null);
	const [inputUrl, setInputUrl] = useState("");
	const [newColName, setNewColName] = useState("");
	const [showNewCol, setShowNewCol] = useState(false);
	// Collection name editing
	const [editingColId, setEditingColId] = useState<string | null>(null);
	const [editingColName, setEditingColName] = useState("");

	const shown = activeCol === null ? bookmarks : bookmarks.filter((b) => b.collectionId === activeCol);
	const totalCount = bookmarks.length;
	const countFor = (id: string) => bookmarks.filter((b) => b.collectionId === id).length;
	const activeColName = activeCol === null ? "All Bookmarks" : (collections.find((c) => c.id === activeCol)?.name ?? "");

	const handleAddBookmark = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();
			const raw = inputUrl.trim();
			if (!raw) return;

			const url = normalizeUrl(raw);
			const domain = getDomain(url);
			const tempId = `temp-${Date.now()}`;

			const tempBookmark: Bookmark = {
				id: tempId,
				url,
				title: domain,
				favicon: fav(domain),
				domain,
				collectionId: activeCol,
				addedAt: Date.now(),
				loading: true,
			};

			setBookmarks((prev) => [tempBookmark, ...prev]);
			setInputUrl("");

			try {
				const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
				if (res.ok) {
					const meta = await res.json();
					setBookmarks((prev) =>
						prev.map((b) => (b.id === tempId ? { ...b, title: meta.title, favicon: meta.favicon, loading: false } : b))
					);
				} else {
					setBookmarks((prev) => prev.map((b) => (b.id === tempId ? { ...b, loading: false } : b)));
				}
			} catch {
				setBookmarks((prev) => prev.map((b) => (b.id === tempId ? { ...b, loading: false } : b)));
			}
		},
		[inputUrl, activeCol]
	);

	const handleDelete = useCallback((id: string) => {
		setBookmarks((prev) => prev.filter((b) => b.id !== id));
	}, []);

	const handleUpdateBookmarkTitle = useCallback((id: string, title: string) => {
		const trimmed = title.trim();
		if (!trimmed) return;
		setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, title: trimmed } : b)));
	}, []);

	const handleAddCollection = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			const name = newColName.trim();
			if (!name) return;
			const id = name
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");
			setCollections((prev) => [...prev, { id, name }]);
			setNewColName("");
			setShowNewCol(false);
			setActiveCol(id);
		},
		[newColName]
	);

	const handleStartEditCol = useCallback((col: Collection) => {
		setEditingColId(col.id);
		setEditingColName(col.name);
	}, []);

	const handleSaveEditCol = useCallback(() => {
		if (editingColId && editingColName.trim()) {
			setCollections((prev) => prev.map((c) => (c.id === editingColId ? { ...c, name: editingColName.trim() } : c)));
		}
		setEditingColId(null);
	}, [editingColId, editingColName]);

	return (
		<div className="flex h-screen bg-[#090909] overflow-hidden animate-fade-in">
			{/* ── Sidebar ─────────────────────────────────────────────── */}
			<aside className="w-[232px] flex-shrink-0 flex flex-col bg-[#0d0d0d] border-r border-[#181818]">
				{/* Logo */}
				<div className="px-6 pt-8 pb-7">
					<span className="font-serif text-[23px] leading-none tracking-[-0.02em] text-[#c8a96e]">keeply</span>
				</div>

				{/* Section label */}
				<p className="px-6 mb-2 text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-[#2d2d2d]">Collections</p>

				{/* Nav */}
				<nav className="flex-1 px-3 overflow-y-auto">
					{/* All — not editable */}
					<NavItem label="All" count={totalCount} icon={<GridIcon />} active={activeCol === null} onClick={() => setActiveCol(null)} />

					<div className="mt-[3px] space-y-[2px]">
						{collections.map((col) =>
							editingColId === col.id ? (
								// Inline editing state
								<div
									key={col.id}
									className="flex items-center gap-[10px] px-3 py-[8px] rounded-[6px] bg-[#161616]"
								>
									<span className="flex-shrink-0 text-[#c8a96e]">{getIcon(col.id)}</span>
									<input
										autoFocus
										value={editingColName}
										onChange={(e) => setEditingColName(e.target.value)}
										onBlur={handleSaveEditCol}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleSaveEditCol();
											if (e.key === "Escape") setEditingColId(null);
										}}
										className="flex-1 min-w-0 bg-transparent text-[13px] font-sans font-medium text-[#e0e0e0] outline-none border-b border-[#333] pb-[1px]"
									/>
								</div>
							) : (
								<NavItem
									key={col.id}
									label={col.name}
									count={countFor(col.id)}
									icon={getIcon(col.id)}
									active={activeCol === col.id}
									onClick={() => setActiveCol(col.id)}
									onEdit={() => handleStartEditCol(col)}
								/>
							)
						)}
					</div>

					{/* New collection */}
					<div className="mt-3">
						{showNewCol ? (
							<form onSubmit={handleAddCollection} className="px-1">
								<input
									autoFocus
									value={newColName}
									onChange={(e) => setNewColName(e.target.value)}
									onBlur={() => {
										if (!newColName.trim()) setShowNewCol(false);
									}}
									onKeyDown={(e) => e.key === "Escape" && setShowNewCol(false)}
									placeholder="Name..."
									className="w-full h-9 px-3 bg-[#141414] border border-[#232323] rounded-md text-[12px] font-sans text-[#e0e0e0] placeholder-[#353535] outline-none focus:border-[#2e2e2e]"
								/>
							</form>
						) : (
							<button
								onClick={() => setShowNewCol(true)}
								className="flex items-center gap-[10px] px-4 py-2 text-[#303030] hover:text-[#555] transition-colors w-full"
							>
								<PlusIcon />
								<span className="text-[12px] font-sans">New collection</span>
							</button>
						)}
					</div>
				</nav>

				{/* Footer */}
				<div className="px-6 py-5 border-t border-[#161616]">
					<p className="text-[10px] font-mono text-[#272727]">
						{totalCount} {totalCount === 1 ? "bookmark" : "bookmarks"} saved
					</p>
				</div>
			</aside>

			{/* ── Main ────────────────────────────────────────────────── */}
			<main className="flex-1 flex flex-col overflow-hidden min-w-0">
				{/* Input area — centered, constrained */}
				<div className="flex-shrink-0">
					<div className="max-w-[640px] mx-auto px-6 pt-8 pb-7">
						<p className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-[#333] mb-5">{activeColName}</p>

						<form onSubmit={handleAddBookmark}>
							<div className="relative flex items-center">
								<input
									value={inputUrl}
									onChange={(e) => setInputUrl(e.target.value)}
									placeholder="Paste a URL to save..."
									type="text"
									spellCheck={false}
									autoComplete="off"
									autoCorrect="off"
									className="url-input w-full h-[46px] pl-4 pr-12 bg-[#111] border border-[#1d1d1d] rounded-[8px] font-mono text-[13px] text-[#d0d0d0] placeholder-[#2c2c2c] outline-none transition-colors duration-200 focus:border-[#252525] focus:bg-[#121212]"
								/>
								<button
									type="submit"
									disabled={!inputUrl.trim()}
									className="absolute right-3 text-[#353535] hover:text-[#c8a96e] disabled:text-[#1f1f1f] disabled:cursor-not-allowed transition-colors duration-150"
								>
									<ArrowRightIcon />
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Divider — full width */}
				<div className="border-t border-[#131313]" />

				{/* Bookmarks — full-width rows, centered content */}
				<div className="flex-1 overflow-y-auto">
					{shown.length === 0 ? (
						<EmptyState />
					) : (
						<ul>
							{shown.map((bookmark, i) => (
								<BookmarkRow
									key={bookmark.id}
									bookmark={bookmark}
									index={i}
									onDelete={handleDelete}
									onUpdateTitle={handleUpdateBookmarkTitle}
								/>
							))}
						</ul>
					)}
				</div>
			</main>
		</div>
	);
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function NavItem({
	label,
	count,
	icon,
	active,
	onClick,
	onEdit,
}: {
	label: string;
	count: number;
	icon: React.ReactNode;
	active: boolean;
	onClick: () => void;
	onEdit?: () => void;
}) {
	return (
		<div className="relative group/nav">
			<button
				onClick={onClick}
				className={`w-full flex items-center gap-[10px] px-3 py-[8px] rounded-[6px] text-left transition-all duration-150 ${
					active ? "bg-[#161616] text-[#e0e0e0]" : "text-[#484848] hover:text-[#888] hover:bg-[#131313]"
				}`}
			>
				<span className={`flex-shrink-0 transition-colors ${active ? "text-[#c8a96e]" : "text-current"}`}>{icon}</span>
				<span className="font-sans text-[13px] font-medium flex-1">{label}</span>
				{/* Count fades out on hover to reveal edit icon */}
				<span className={`font-mono text-[11px] text-[#2d2d2d] transition-opacity ${onEdit ? "group-hover/nav:opacity-0" : ""}`}>
					{count}
				</span>
			</button>

			{/* Edit button — floats over count on hover */}
			{onEdit && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onEdit();
					}}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2e2e2e] hover:text-[#888] opacity-0 group-hover/nav:opacity-100 transition-all duration-150"
					title="Rename collection"
				>
					<MiniEditIcon />
				</button>
			)}
		</div>
	);
}

function BookmarkRow({
	bookmark,
	index,
	onDelete,
	onUpdateTitle,
}: {
	bookmark: Bookmark;
	index: number;
	onDelete: (id: string) => void;
	onUpdateTitle: (id: string, title: string) => void;
}) {
	const [faviconError, setFaviconError] = useState(false);
	const [editingTitle, setEditingTitle] = useState(false);
	const [titleValue, setTitleValue] = useState(bookmark.title);

	// Keep local title in sync when external update comes in (e.g. after metadata load)
	useEffect(() => {
		if (!editingTitle) setTitleValue(bookmark.title);
	}, [bookmark.title, editingTitle]);

	const saveTitle = useCallback(() => {
		const trimmed = titleValue.trim();
		if (trimmed) onUpdateTitle(bookmark.id, trimmed);
		else setTitleValue(bookmark.title); // revert if blank
		setEditingTitle(false);
	}, [titleValue, bookmark.id, bookmark.title, onUpdateTitle]);

	return (
		<li
			className="group border-b border-[#121212] hover:bg-[#0e0e0e] transition-colors duration-100 animate-slide-down"
			style={{ animationDelay: index < 10 ? `${index * 22}ms` : "0ms" }}
		>
			{/* Inner wrapper: centers content, constrained width */}
			<div className="max-w-[640px] mx-auto flex items-center gap-4 px-6">
				{/* Favicon */}
				<div className="flex-shrink-0 w-5 h-5 my-[15px]">
					{bookmark.loading ? (
						<div className="w-5 h-5 rounded-[4px] shimmer" />
					) : faviconError ? (
						<div className="w-5 h-5 rounded-[4px] bg-[#1e1e1e] flex items-center justify-center">
							<span className="text-[9px] font-sans text-[#555] uppercase">{bookmark.domain[0] ?? "?"}</span>
						</div>
					) : (
						<img
							src={bookmark.favicon}
							alt=""
							width={20}
							height={20}
							className="rounded-[4px] object-cover"
							onError={() => setFaviconError(true)}
						/>
					)}
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0 py-[15px]">
					{bookmark.loading ? (
						<div className="space-y-[7px]">
							<div className="h-[13px] shimmer rounded w-44" />
							<div className="h-[10px] shimmer rounded w-28" />
						</div>
					) : editingTitle ? (
						<input
							autoFocus
							value={titleValue}
							onChange={(e) => setTitleValue(e.target.value)}
							onBlur={saveTitle}
							onKeyDown={(e) => {
								if (e.key === "Enter") saveTitle();
								if (e.key === "Escape") {
									setTitleValue(bookmark.title);
									setEditingTitle(false);
								}
							}}
							className="w-full bg-transparent text-[13px] font-sans font-medium text-[#d0d0d0] outline-none border-b border-[#2e2e2e] pb-[1px] leading-none mb-[6px]"
						/>
					) : (
						<>
							<p
								onClick={() => !bookmark.loading && setEditingTitle(true)}
								title="Click to edit"
								className="text-[13px] font-sans font-medium text-[#d0d0d0] truncate leading-none mb-[6px] cursor-text hover:text-[#e8e8e8] transition-colors"
							>
								{bookmark.title}
							</p>
							<p className="text-[11px] font-mono text-[#3a3a3a] truncate leading-none">{bookmark.domain}</p>
						</>
					)}
				</div>

				{/* Actions — revealed on hover */}
				<div className="flex-shrink-0 flex items-center gap-3 py-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
					<a
						href={bookmark.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#303030] hover:text-[#777] transition-colors"
						tabIndex={-1}
					>
						<ExternalLinkIcon />
					</a>
					<button onClick={() => onDelete(bookmark.id)} className="text-[#303030] hover:text-red-400/60 transition-colors">
						<TrashIcon />
					</button>
				</div>
			</div>
		</li>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center h-64 select-none">
			<p className="font-serif text-[28px] italic text-[#242424]">Nothing here yet.</p>
			<p className="font-mono text-[11px] text-[#202020] mt-2">Paste a URL above to add your first bookmark</p>
		</div>
	);
}
