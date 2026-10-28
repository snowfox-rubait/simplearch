You can navigate around this TUI with the arrow keys, or with `j`/`k` like vim. `/` opens a fuzzy finder (only in sub-menus where fuzzy finding is available/enabled). `Esc` cancels, and also takes you back from a sub-menu. `Enter` selects. Use `Space` if you're in a multi-select menu instead of a single-select one — `Tab` doesn't work for this.

**Archinstall language**: default
**Locales**: default
**Mirrors and repos**: set the region to your own country (or a nearby one) for better download speeds. Add `multilib` as an additional repo — you'll need it for important 32-bit libraries (e.g. Steam, Wine, Proton need them; there are more use cases too).

### Disk configuration

Best-effort (in most cases) > Btrfs (most recommended) > use default volume structure > use compression (do **not** disable copy-on-write).

Don't touch LVM.

**Disk encryption** (recommended) — you can skip it, but I'd rather you didn't.
- **Encryption type**: LUKS (you don't have another choice yet)
- **Encryption password**: set your own
- **Iteration time**: keep as is
- **Partition**: select the partition
- **HSM**: this is for setting up a YubiKey or similar physical security key. Do your own research on this — most people should skip it.

Then go back from the encryption sub-menu and select Btrfs snapshots.

**Snapshot tool**: Snapper (recommended). Timeshift is also a good option, but Snapper has a few advantages — mainly, it's what integrates with boot-menu snapshot rollback later.

### Swap

Enable this. You have two options worth knowing:
1. **zstd** — for modern CPUs
2. **lz4** — for very old/weak hardware

The rest is just noise, skip it.

### Bootloader

This is entirely your own choice, but here's what I recommend: use either GRUB or Limine. Both are good — the other options lack the features needed to link snapshots to the bootloader the way Omarchy does.

**Plymouth**: on old hardware, keep it disabled. Otherwise, keep it enabled and select the "details" option — this makes it much easier to diagnose issues on your first install. You can switch to a nicer-looking theme later once everything's confirmed working.

**Unified Kernel Image**: this bundles your kernel, initramfs, and boot parameters into a single signed executable file. It's useful later on for signing your bootloader and setting up Secure Boot, but that's a topic for another day. For now, **keep it disabled** — Limine doesn't detect UKIs automatically, and getting the two working together reliably needs extra tooling. Get it wrong and you can end up with a boot entry that kernel-panics *and* a missing snapshot menu right when you need it most — which defeats the whole point of the Omarchy-style rollback setup we're going for here.

**Install to removable location**: keep this **disabled**. This installs the bootloader to a generic fallback path instead of registering a proper boot entry for this specific machine — it's meant for portable USB installs or firmware with broken boot-entry handling, not a normal internal-disk desktop install. Leave it off unless you have a specific reason to need it.

### Kernel

You can select more than one kernel here. You might be wondering — why more than one, and what's the difference? Quick rundown:

- **linux** — the vanilla, mainline Arch kernel. Tracks upstream Linux releases closely and gets the latest features/hardware support fastest. This is the default for good reason: it's the most tested by the broadest swath of the Arch community, so it's the safest, best-documented path — if you hit a weird bug, there's a good chance someone else already has too.
- **linux-lts** — "Long Term Support." Based on an older upstream release line that gets backported security/bug fixes but not new feature churn. You trade bleeding-edge hardware support for stability and fewer regressions between updates. A common pattern: install `linux-lts` as a *second* kernel alongside `linux`, purely as a fallback. If a `linux` update ever breaks something (bad driver regression, etc.), you boot into `linux-lts` from the boot menu while you sort it out. This pairs really well with the Snapper + Limine rollback setup — a kernel-level fallback on top of your filesystem-level one.
- **linux-zen** — a variant tuned for desktop responsiveness, with extra scheduler patches aimed at making the system feel snappier under load. Not "faster" in a raw-throughput sense — more about lower perceived latency during normal desktop use (gaming, audio/video work, multitasking). Popular with the gaming/desktop crowd, and the kernel CachyOS-style performance setups tend to lean on.
- **linux-hardened** — a security-focused variant with extra kernel hardening patches (stricter defaults, additional exploit mitigations, some features disabled that would otherwise widen the attack surface). Trades a bit of performance and occasionally some compatibility (certain proprietary drivers, some AUR packages expecting vanilla kernel behavior — NVIDIA's proprietary driver in particular) for a meaningfully smaller attack surface. Good if you have a genuine security-focused use case, not something to default to otherwise.

Quick picks:
- **Default / general use** → `linux`
- **Stability-focused / fallback safety net** → `linux` + `linux-lts`
- **Gaming / desktop responsiveness** → `linux-zen` + `linux-lts`
- **Security-focused** → `linux-hardened` + `linux-lts` (keep in mind the NVIDIA/proprietary-driver friction mentioned above)

Yes, you can select more than one. I'd suggest `linux` + `linux-lts`, or `linux-zen` + `linux-lts`, or `linux-hardened` + `linux-lts` — or just one of them if you'd rather keep it simple.

### Hostname

What's a hostname? Hostname is the computer's name — username is *your* name. Don't mix them up.

Here's the fuller explanation, in case it's useful:

A hostname identifies the *machine* on a network — it's how other devices, your router, or you yourself (when SSH-ing in, say) refer to that specific computer. "haw-desktop" or "elitedesk-800" — it doesn't care who's logged into it, it's a property of the machine itself, the same way a house has a street address regardless of who's living there.

A username identifies *you* as a specific account on that machine — this matters more once you remember multiple people (or restricted accounts) can exist on the same computer. The hostname stays the same no matter who logs in; the username changes depending on who's using it.

If you SSH into your machine from another device, you type `username@hostname` — e.g. `haw@elitedesk-800`. That syntax is honestly the cleanest way to remember it: "*who* @ *which machine*." Username is the who, hostname is the where.

Just set a machine name and move on. Example: `kitchen-pc`, `server-pc`, `laptop` — or literally anything that helps you tell your machines apart on the network.

### Authentication

You'll see three options here:

1. Root password
2. User account
3. U2F login setup

For most users, leave the first option alone. Skip it unless you specifically want a separate, dedicated root account — and don't enable it if you don't already know why you'd want to. Don't confuse this with `sudo`, which you'll set up separately in the next option. The `root` account is a different thing entirely, and leaving it disabled (no password set) is actually the more secure default — it means there's no way to log in as root directly, so `sudo` becomes the only path to admin access, which is both safer and easier to keep track of.

The third option, **U2F login setup**, is basically the same idea as the HSM option back in disk encryption — it lets you enroll a physical key (YubiKey, FIDO2, etc.) for logging in.

The important one is the second option, **User account**. This is where you create your actual user account — you can add more than one if you want. For each one, you can turn `sudo` on or off. Add your username, set a password, decide whether that user gets `sudo`, and you're done.

### Profile

This is the big one — take your time here and experiment a bit.

Opening the sub-menu, you'll first see **Type**, with four options:

1. Desktop
2. Minimal
3. Server
4. Xorg

These are really just asking what you're building: a headless server, just the Xorg display server on its own, a bare minimal system, or a fully bundled desktop environment so you don't have to install everything by hand. None of these come pre-configured out of the box — you'll still need to configure whatever you pick after install finishes.

Don't know what a desktop environment, window manager, display server, or compositor actually is? Go read up on them — {link}. This isn't optional if you want to actually understand what you're running.

**Minimal** installs Arch with no desktop environment, window manager, or anything graphical at all. After install, you'll boot to a console with a blinking cursor and nothing else. Good if you know what you're doing and plan to build everything yourself afterward — also the pick if you don't have an internet connection during install.

**Server** sets your machine up as a headless box you'll be SSH-ing into — no GUI.

**Xorg** installs just the Xorg display server, with no desktop environment or window manager on top — so you can build your own afterward.

**Desktop** gives you a ready-made bundle — you'll see a long list of options here, and not all of them are full desktop environments; some are compositors, some are bare window managers. Either way, you get a working system with the basics pre-installed. Pre-installed doesn't mean pre-configured — you'll still need to set things up before it's actually usable. More on this here — {link}. You'll also get a few extra choices after picking your profile (graphics drivers, greeter, etc.) — more on those here — {link}.

Note: this option needs an internet connection to install. Make sure your connection's solid before you start.

So which one should you pick? If you're new and don't want to deal with installing and configuring everything from scratch — but you *do* want to actually rice your own setup — go with **Minimal**. That might feel backwards, since Desktop looks like the easier option. Hear me out.

Picking Desktop hands you a bundle you didn't really choose piece by piece — you might like it, you might not. If you want your system to actually feel like *yours*, Minimal is the better starting point. So how do you set it up afterward? That's exactly what our [SimpleArch]{link} project is for — {brief description of how the project helps post-install}.

That said, there are real cases where Desktop makes sense. Some of the bundled options are genuinely solid, full desktop environments, and picking one can get you a setup that "just works" without the extra legwork. More on that here — {link}.

TL;DR: pick **Minimal**, then use a post-install script for everything else.

### Application

Don't let the name fool you — this isn't about installing apps. This step handles Bluetooth, printer drivers, audio, firewall, and a few additional terminal fonts.

- **Bluetooth** = `yes`
- **Audio** = `PipeWire` (not PulseAudio — more on why here — {link})
- **Printing services** = `yes` (you'll need it eventually)
- **Firewall** = `ufw` for simplicity, `firewalld` for more advanced setups. `ufw` covers 99% of cases and is far easier to use, so go with that. More on this here — {link}.
- **Additional fonts** = optional, pick whatever you like or skip it entirely — doesn't matter much either way.

### Network configuration

You'll see five options here, but two really matter:

1. Network Manager (default backend)
2. Network Manager (iwd backend)

Which one should you pick? As a rough guide: default backend if your wifi hardware predates ~2014, `iwd` if it's newer. `iwd` is generally more efficient, but it's newer and less battle-tested — and how well it works can depend on your specific wifi chipset (Intel tends to do well with it; some Realtek chipsets have had rougher experiences). More detailed comparison here — {link}.

### Pacman

There's basically nothing here. Just set `color` to `true`/enabled. That's it.

### Additional packages

This is a list of packages you might want installed right away — keep in mind this needs an internet connection. There's a fuzzy finder here, so feel free to grab a few if you want, but it's not required — you can always install things post-install too.

A few worth considering: {essential package list}

### Timezone

Exactly what it sounds like — there's a fuzzy finder, just pick your timezone.

### Automatic time sync

Keep this enabled.

---

Once you've gone through everything, double-check your selections, then hit **Install**. It'll ask for confirmation — once you confirm, there's no going back.

From there, sit back. It should take somewhere between 3–10 minutes depending on your internet speed, disk speed, and CPU. If it's taking more than 15 minutes, something's probably wrong.

### Rebooting into your new system

Once the installation completes, `archinstall` will show a prompt: **"What would you like to do next?"** with three options:
1. Exit archinstall
2. **Reboot system** (recommended)
3. chroot into installation for post-installation configurations

Select **Reboot system**, press Enter, and remove your USB installation flash drive when the machine restarts. You will boot directly into your fresh, clean Arch Linux installation with a working terminal and network connection, ready for SimpleArch.

