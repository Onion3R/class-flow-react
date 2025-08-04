// import { Button } from "@/components/ui/button";
// import { ChevronDown, Clipboard, ClipboardCheck, ExternalLink } from "lucide-react";
// import { useState, useEffect } from "react";
// import {
//     Dialog,
//     DialogClose,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";
// // Assuming this path is correct for your Checkbox component
// import { Checkbox } from "@/Components/ui/checkbox";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/components/ui/command";

// // IMPORTANT: Import the generateInviteLink function from your apiService
// // Make sure the path is correct for your project structure.
// import { generateInviteLink } from "@/services/apiService";


// export default function ShareDialog() {
//     const roles = [
//         { value: 'admin', label: 'Admin', desc: 'Has full access to all features and settings.' },
//         { value: 'instructor', label: 'Instructor', desc: 'Can edit content but not manage settings.' }
//     ];

//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [selectedRoleValue, setSelectedRoleValue] = useState(roles[0].value); // Store the actual value for API
//     const [selectedRoleLabel, setSelectedRoleLabel] = useState(roles[0].label); // Store the label for display
//     const [expirationDays, setExpirationDays] = useState(''); // State for expiration days input
//     const [generatedLink, setGeneratedLink] = useState(''); // State to hold the generated link
//     const [isCopied, setIsCopied] = useState(false); // State for copy button icon
//     const [loading, setLoading] = useState(false); // State for loading indicator
//     const [error, setError] = useState(''); // State for error messages
//     const [isRolePopoverOpen, setIsRolePopoverOpen] = useState(false); // State for Popover open/close

//     // Effect to reset copy icon after a short delay
//     useEffect(() => {
//         if (isCopied) {
//             const timer = setTimeout(() => setIsCopied(false), 2000);
//             return () => clearTimeout(timer);
//         }
//     }, [isCopied]);

//     // Effect to reset states when dialog opens/closes
//     useEffect(() => {
//         if (!isDialogOpen) {
//             // Reset states when dialog closes
//             setGeneratedLink('');
//             setExpirationDays('');
//             setError('');
//             setIsCopied(false);
//             setLoading(false);
//             setSelectedRoleValue(roles[0].value); // Reset to default role
//             setSelectedRoleLabel(roles[0].label);
//         }
//     }, [isDialogOpen, roles]); // Add roles to dependency array if it can change

//     const handleCopyLink = () => {
//         if (generatedLink) {
//             navigator.clipboard.writeText(generatedLink)
//                 .then(() => {
//                     setIsCopied(true);
//                     // You might want to use a toast notification here instead of an alert
//                 })
//                 .catch(err => {
//                     console.error("Failed to copy link: ", err);
//                     setError("Failed to copy link.");
//                 });
//         }
//     };

//     const handleGenerateLink = async () => {
//         setLoading(true);
//         setError('');
//         setGeneratedLink(''); // Clear previous link
//         setIsCopied(false);

//         try {
//             // Pass selectedRoleValue (e.g., 'admin', 'instructor') and expirationDays
//             const days = expirationDays === '' ? null : parseInt(expirationDays, 10);
//             if (days !== null && (isNaN(days) || days < 0)) {
//                 setError("Expiration days must be a non-negative number.");
//                 setLoading(false);
//                 return;
//             }

//             const response = await generateInviteLink(selectedRoleValue, days);
//             setGeneratedLink(response.invite_url); // Assuming the API returns { invite_url: "..." }
//         } catch (err) {
//             setError(err.message || "An unexpected error occurred while generating the link.");
//             console.error("Generate link error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//                 <Button variant="default" className="ml-2"> <ExternalLink /> Share</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                     <DialogTitle>Share link</DialogTitle>
//                     <DialogDescription>
//                         Generate an invitation link for new users with specific roles and expiration.
//                     </DialogDescription>
//                 </DialogHeader>

//                 {/* Role Selection and Expiration */}
//                 <div className="grid gap-4 py-4">
//                     <div className="flex flex-col gap-2">
//                         <Label htmlFor="role-select">User Role</Label>
//                         <Popover open={isRolePopoverOpen} onOpenChange={setIsRolePopoverOpen}>
//                             <PopoverTrigger asChild>
//                                 <Button
//                                     variant="outline"
//                                     role="combobox"
//                                     aria-expanded={isRolePopoverOpen}
//                                     className="justify-between"
//                                 >
//                                     {selectedRoleLabel} <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                 </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
//                                 <Command>
//                                     <CommandInput placeholder="Search roles..." />
//                                     <CommandList>
//                                         <CommandEmpty>No roles found.</CommandEmpty>
//                                         <CommandGroup>
//                                             {roles.map((role) => (
//                                                 <CommandItem
//                                                     key={role.value}
//                                                     value={role.label} // Use label for command item value for search
//                                                     onSelect={() => {
//                                                         setSelectedRoleValue(role.value);
//                                                         setSelectedRoleLabel(role.label);
//                                                         setIsRolePopoverOpen(false); // Close popover on selection
//                                                     }}
//                                                     className={`cursor-pointer ${selectedRoleValue === role.value ? 'bg-accent text-accent-foreground' : ''}`}
//                                                 >
//                                                     <div className="flex flex-col">
//                                                         <span className="text-sm font-medium">{role.label}</span>
//                                                         <span className="text-muted-foreground text-xs">{role.desc}</span>
//                                                     </div>
//                                                 </CommandItem>
//                                             ))}
//                                         </CommandGroup>
//                                     </CommandList>
//                                 </Command>
//                             </PopoverContent>
//                         </Popover>
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="expiration-days">Expiration Days (Optional)</Label>
//                         <Input
//                             id="expiration-days"
//                             type="number"
//                             min="0"
//                             placeholder="e.g., 7 for 7 days, leave empty for no expiration"
//                             value={expirationDays}
//                             onChange={(e) => setExpirationDays(e.target.value)}
//                         />
//                         <p className="text-xs text-muted-foreground">Set to 0 for immediate expiration once used, or leave empty for no expiration.</p>
//                     </div>

//                     <Button onClick={handleGenerateLink} disabled={loading} className="w-full">
//                         {loading ? 'Generating...' : 'Generate Invitation Link'}
//                     </Button>

//                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//                 </div>

//                 {/* Generated Link Display */}
//                 {generatedLink && (
//                     <div className="flex items-center gap-2 mt-4">
//                         <div className="grid flex-1 gap-2">
//                             <Label htmlFor="generated-link" className="sr-only">
//                                 Generated Link
//                             </Label>
//                             <div className="relative">
//                                 <Input
//                                     id="generated-link"
//                                     value={generatedLink}
//                                     readOnly
//                                     className="pr-10" // Make space for the copy button
//                                 />
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="absolute right-0 top-0 h-full px-3 py-1.5 rounded-l-none"
//                                     onClick={handleCopyLink}
//                                 >
//                                     {isCopied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
//                                     <span className="sr-only">Copy Link</span>
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <DialogFooter className="sm:justify-start mt-4">
//                     <DialogClose asChild>
//                         <Button type="button" variant="secondary">
//                             Close
//                         </Button>
//                     </DialogClose>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }

import React, { useState, useEffect } from 'react';
import subjectGetter from '../lib/hooks/useSubjectStrand'; // Assuming useSubject.js is in the same directory

function Test() {
  // Get the raw data and loading state from your custom hook
  const { data: allRawData, isLoading, groupedSubjects } = subjectGetter();
  
  // Declare the state to hold the data filtered by track ID
  const [dataSelectedByTrack, setDataSelectedByTrack] = useState([]);

  // Use useEffect to filter the data once it's loaded
  useEffect(() => {
    if (allRawData && Array.isArray(allRawData) && allRawData.length > 0) {
      const filtered = allRawData.filter(item => {
        // Safely check for nested properties and filter for track.id === 1
        return item.strand && item.strand.track && item.strand.track.id === 1;
      });
      setDataSelectedByTrack(filtered); // Set the filtered data into state
    } else {
      // If data is empty or not yet loaded, clear the filtered state
      setDataSelectedByTrack([]);
    }
  }, [allRawData]); // Re-run this effect whenever allRawData changes

  console.log("Original All Raw Data:", allRawData);
  console.log("Data Selected By Track (ID = 1):", dataSelectedByTrack);
  console.log("Is Loading:", isLoading);
  console.log("Grouped Subjects (if used):", groupedSubjects);

  if (isLoading) {
    return <div>Loading subjects...</div>;
  }

  // Check if dataSelectedByTrack is populated
  const hasSelectedData = dataSelectedByTrack && dataSelectedByTrack.length > 0;

  return (
    <div>
      <h1>Subject Data for Academic Track (track.id = 1)</h1>
      {hasSelectedData ? (
        <pre>{JSON.stringify(dataSelectedByTrack, null, 2)}</pre>
      ) : (
        <p>No subject data found for track ID 1, or still loading.</p>
      )}
    </div>
  );
}

export default Test;